"""Increase activity description length to 1000

Revision ID: c7f4e2a1b9d0
Revises: d2a8f5e9c1b4
Create Date: 2026-04-09 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c7f4e2a1b9d0'
down_revision = 'd2a8f5e9c1b4'
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column(
        'activity',
        'description',
        existing_type=sa.String(length=500),
        type_=sa.String(length=1000),
        existing_nullable=True,
    )


def downgrade():
    op.alter_column(
        'activity',
        'description',
        existing_type=sa.String(length=1000),
        type_=sa.String(length=500),
        existing_nullable=True,
    )
