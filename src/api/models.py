from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from enum import Enum
from typing import List

db = SQLAlchemy()


class roleUser(Enum):
    ADMIN = "admin"
    USER = "user"


class statusUser(Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"


class categoryActivity(Enum):
    DRABBLES = "drabbles"
    NON_SEX = "non-sex"
    QUOTES = "quotes"
    SENSIBLE_CONTENT = "sensible-content"
    EXPLICIT = "explicit"
    AGNUS_DEI = "agnus-dei"
    SPECIAL = "special"
    RECORDIS = "recordis"
    GALLERY = "gallery"
    MUSIC = "music"


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(
        String(120), unique=False, nullable=False)
    code: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    fc: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(128), nullable=False)
    avatar: Mapped[str] = mapped_column(
        String(250), unique=False, nullable=True)
    status: Mapped[statusUser] = mapped_column(
        db.Enum(statusUser), nullable=False)
    role: Mapped[roleUser] = mapped_column(db.Enum(roleUser), nullable=False)

    favorites: Mapped[List['Favorite']] = db.relationship(
        'Favorite', back_populates='user')

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "code": self.code,
            "fc": self.fc,
            "avatar": self.avatar,
            "status": self.status.value,
            "role": self.role.value
        }


class Activity(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(
        String(120), unique=False, nullable=False)
    category: Mapped[categoryActivity] = mapped_column(
        db.Enum(categoryActivity), nullable=False)
    description: Mapped[str] = mapped_column(
        String(1000), unique=False, nullable=True)
    image: Mapped[str] = mapped_column(
        String(250), unique=False, nullable=True)
    code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)

    favorites: Mapped[List['Favorite']] = db.relationship(
        'Favorite', back_populates='activity')

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category.value,
            "description": self.description,
            "image": self.image,
            "code": self.code,
        }


class Favorite(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        db.ForeignKey('user.id'), nullable=False)
    activity_id: Mapped[int] = mapped_column(
        db.ForeignKey('activity.id'), nullable=False)

    user: Mapped[User] = db.relationship('User', back_populates='favorites')
    activity: Mapped[Activity] = db.relationship(
        'Activity', back_populates='favorites')

    def __repr__(self):
        return f"<Favorite user_id={self.user_id} activity_id={self.activity_id}>"

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "activity_id": self.activity_id,
        }
