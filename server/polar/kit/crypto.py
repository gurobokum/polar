import hashlib
import hmac
import secrets


def get_token_hash(token: str, *, secret: str) -> str:
    hash = hmac.new(secret.encode("ascii"), token.encode("ascii"), hashlib.sha256)
    return hash.hexdigest()


def generate_token(*, prefix: str = "", nbytes: int | None = None) -> str:
    return f"{prefix}{secrets.token_urlsafe(nbytes)}"


def generate_token_hash_pair(
    *, secret: str, prefix: str = "", nbytes: int | None = None
) -> tuple[str, str]:
    """
    Generate a token suitable for sensitive values
    like magic link tokens.

    Returns both the actual value and its HMAC-SHA256 hash.
    Only the latter shall be stored in database.
    """
    token = generate_token(prefix=prefix, nbytes=nbytes)
    return token, get_token_hash(token, secret=secret)
