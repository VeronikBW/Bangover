"""Remove activity description length limit

Revision ID: ab12cd34ef56
Revises: c7f4e2a1b9d0
Create Date: 2026-05-02 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ab12cd34ef56'
down_revision = 'c7f4e2a1b9d0'
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
