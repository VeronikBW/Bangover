from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from enum import Enum

db = SQLAlchemy()

class categoryActivity(Enum):
    SPORTS = "sports"
    MUSIC = "music"
    ART = "art"
    FOOD = "food"
    TRAVEL = "travel"

class roleUser(Enum):
    ADMIN = "admin"
    USER = "user"

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=False, nullable=False)
    role: Mapped[roleUser] = mapped_column(db.Enum(roleUser), nullable=False)
    nickname: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "nickname": self.nickname,
            "is_active": self.is_active
        }
    
class Activity(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=False, nullable=False)
    category: Mapped[categoryActivity] = mapped_column(db.Enum(categoryActivity), nullable=False)
    description: Mapped[str] = mapped_column(String(250), unique=False, nullable=True)
    image_url: Mapped[str] = mapped_column(String(250), unique=False, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "description": self.description,
            "image_url": self.image_url,
            "is_active": self.is_active
        }   
    
    