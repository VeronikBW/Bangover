"""Remove activity description length limit

Revision ID: ab12cd34ef56
Revises: f3b2a1c4d5e6
Create Date: 2026-05-02 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ab12cd34ef56'
down_revision = 'f3b2a1c4d5e6'
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column(
        'activity',
        'description',
        existing_type=sa.String(length=1000),
        type_=sa.Text(),
        existing_nullable=True,
    )


def downgrade():
    op.alter_column(
        'activity',
        'description',
        existing_type=sa.Text(),
        type_=sa.String(length=1000),
        existing_nullable=True,
    )
