import secrets
from datetime import datetime, timedelta
from typing import Optional

from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
import jwt

class AuthService:
    SECRET_KEY = secrets.token_hex(32)
    ALGORITHM = "HS256"

    oAuth2_authentication = OAuth2PasswordBearer(tokenUrl="token")
    password_crypto_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    @staticmethod
    def create_token(username: str) -> str:
        expires_time = datetime.utcnow() + timedelta(minutes=30)
        payload = {"sub": username, "exp": expires_time}
        token = jwt.encode(payload, AuthService.SECRET_KEY, algorithm=AuthService.ALGORITHM)
        return token

    @staticmethod
    def verify_token(token: str = Depends(oAuth2_authentication)):
        try:
            payload = jwt.decode(token, AuthService.SECRET_KEY, algorithms=[AuthService.ALGORITHM])
            username: Optional[str] = payload.get("sub")

            if username is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid authentication credentials.",
                    headers={"WWW-Authenticate": "Bearer"},
                )

        except (Exception):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials.",
                headers={"WWW-Authenticate": "Bearer"},
            )

    @staticmethod
    def hash_password(password: str) -> str:
        return AuthService.password_crypto_context.hash(password)

    @staticmethod
    def verify_password(given_password: str, hashed_password: str) -> bool:
        return AuthService.password_crypto_context.verify(given_password, hashed_password)