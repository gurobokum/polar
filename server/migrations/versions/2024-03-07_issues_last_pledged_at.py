"""issues.last_pledged_at

Revision ID: 53e30136e41b
Revises: 7e3d43b4fbcd
Create Date: 2024-03-07 15:29:33.389117

"""

import sqlalchemy as sa
from alembic import op

# Polar Custom Imports
from polar.kit.extensions.sqlalchemy import PostgresUUID

# revision identifiers, used by Alembic.
revision = "53e30136e41b"
down_revision = "7e3d43b4fbcd"
branch_labels: tuple[str] | None = None
depends_on: tuple[str] | None = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "issues",
        sa.Column("last_pledged_at", sa.TIMESTAMP(timezone=True), nullable=True),
    )

    op.execute(
        """
UPDATE issues
SET pledged_amount_sum=s.pledged_amount_sum,
     last_pledged_at=s.last_pledged_at
FROM (SELECT issue_id, SUM(amount) AS pledged_amount_sum, MAX(created_at) AS last_pledged_at FROM pledges WHERE state IN ('created','pending','disputed') GROUP BY issue_id) AS s
WHERE id=s.issue_id;
               """
    )

    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("issues", "last_pledged_at")
    # ### end Alembic commands ###
