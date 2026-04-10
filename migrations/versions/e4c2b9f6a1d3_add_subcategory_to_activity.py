"""add subcategory to activity

Revision ID: e4c2b9f6a1d3
Revises: c7f4e2a1b9d0
Create Date: 2026-04-10 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e4c2b9f6a1d3'
down_revision = 'c7f4e2a1b9d0'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('activity', sa.Column(
        'subcategory', sa.String(length=100), nullable=True))


def downgrade():
    op.drop_column('activity', 'subcategory')
