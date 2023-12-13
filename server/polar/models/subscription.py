from datetime import UTC, datetime
from enum import StrEnum
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import (
    TIMESTAMP,
    Boolean,
    ColumnElement,
    ForeignKey,
    Integer,
    String,
    and_,
    or_,
    type_coerce,
)
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import (
    Mapped,
    declared_attr,
    mapped_column,
    relationship,
)

from polar.kit.db.models import RecordModel
from polar.kit.extensions.sqlalchemy import PostgresUUID
from polar.kit.utils import utc_now

if TYPE_CHECKING:
    from polar.models import SubscriptionTier, User


class SubscriptionStatus(StrEnum):
    incomplete = "incomplete"
    incomplete_expired = "incomplete_expired"
    trialing = "trialing"
    active = "active"
    past_due = "past_due"
    canceled = "canceled"
    unpaid = "unpaid"


class Subscription(RecordModel):
    __tablename__ = "subscriptions"

    stripe_subscription_id: Mapped[str] = mapped_column(
        String, nullable=True, index=True, default=None
    )

    status: Mapped[SubscriptionStatus] = mapped_column(String, nullable=False)
    current_period_start: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), nullable=False
    )
    current_period_end: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), nullable=True, default=None
    )
    cancel_at_period_end: Mapped[bool] = mapped_column(Boolean, nullable=False)
    started_at: Mapped[datetime | None] = mapped_column(
        TIMESTAMP(timezone=True), nullable=True, default=None
    )
    ended_at: Mapped[datetime | None] = mapped_column(
        TIMESTAMP(timezone=True), nullable=True, default=None
    )

    price_currency: Mapped[str] = mapped_column(String(3), nullable=False)
    price_amount: Mapped[int] = mapped_column(Integer, nullable=False)

    user_id: Mapped[UUID] = mapped_column(
        PostgresUUID,
        ForeignKey("users.id", ondelete="cascade"),
        nullable=False,
        index=True,
    )

    @declared_attr
    def user(cls) -> Mapped["User"]:
        return relationship("User", lazy="raise")

    subscription_tier_id: Mapped[UUID] = mapped_column(
        PostgresUUID,
        ForeignKey("subscription_tiers.id", ondelete="cascade"),
        nullable=False,
        index=True,
    )

    @declared_attr
    def subscription_tier(cls) -> Mapped["SubscriptionTier"]:
        return relationship("SubscriptionTier", lazy="raise")

    def is_incomplete(self) -> bool:
        return self.status in [
            SubscriptionStatus.incomplete,
            SubscriptionStatus.incomplete_expired,
        ]

    @hybrid_property
    def active(self) -> bool:
        if self.status in [SubscriptionStatus.trialing, SubscriptionStatus.active]:
            return True

        if (
            self.status == SubscriptionStatus.canceled
            and self.ended_at
            and self.ended_at > utc_now()
        ):
            return True

        return False

    @active.inplace.expression
    @classmethod
    def _active_expression(cls) -> ColumnElement[bool]:
        return or_(
            type_coerce(
                cls.status.in_(
                    [SubscriptionStatus.trialing, SubscriptionStatus.active]
                ),
                Boolean,
            ),
            and_(
                Subscription.status == SubscriptionStatus.canceled,
                Subscription.ended_at > utc_now(),
            ),
        )

    @hybrid_property
    def canceled(self) -> bool:
        return self.status in [
            SubscriptionStatus.past_due,
            SubscriptionStatus.canceled,
            SubscriptionStatus.unpaid,
        ]

    @canceled.inplace.expression
    @classmethod
    def _canceled_expression(cls) -> ColumnElement[bool]:
        return type_coerce(
            cls.status.in_(
                [
                    SubscriptionStatus.past_due,
                    SubscriptionStatus.canceled,
                    SubscriptionStatus.unpaid,
                ]
            ),
            Boolean,
        )

    def set_started_at(self) -> None:
        """
        Stores the starting date when the subscription
        becomes active for the first time.
        """
        if self.active and self.started_at is None:
            self.started_at = datetime.now(UTC)
