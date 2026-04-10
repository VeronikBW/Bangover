"""remove moral and crime subcategory

Revision ID: f3b2a1c4d5e6
Revises: e4c2b9f6a1d3
Create Date: 2026-04-10 00:30:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f3b2a1c4d5e6'
down_revision = 'e4c2b9f6a1d3'
branch_labels = None
depends_on = None


def upgrade():
    op.execute(
        sa.text(
            "UPDATE activity SET subcategory = NULL WHERE subcategory = 'moral-and-crime'"
        )
    )


def downgrade():
    # Data cleanup migration; removed subcategory values are not restored automatically.
    pass
