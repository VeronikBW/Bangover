"""Add missing categoryactivity enum values

Revision ID: 386d4f5b0211
Revises: 276827933149
Create Date: 2026-03-28 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '386d4f5b0211'
down_revision = '96129a1b03de'
branch_labels = None
depends_on = None


def upgrade():
    op.execute("ALTER TYPE categoryactivity ADD VALUE IF NOT EXISTS 'DRABBLES'")
    op.execute("ALTER TYPE categoryactivity ADD VALUE IF NOT EXISTS 'NON_SEX'")
    op.execute("ALTER TYPE categoryactivity ADD VALUE IF NOT EXISTS 'QUOTES'")
    op.execute(
        "ALTER TYPE categoryactivity ADD VALUE IF NOT EXISTS 'SENSIBLE_CONTENT'")
    op.execute("ALTER TYPE categoryactivity ADD VALUE IF NOT EXISTS 'EXPLICIT'")
    op.execute("ALTER TYPE categoryactivity ADD VALUE IF NOT EXISTS 'AGNUS_DEI'")
    op.execute("ALTER TYPE categoryactivity ADD VALUE IF NOT EXISTS 'SPECIAL'")
    op.execute("ALTER TYPE categoryactivity ADD VALUE IF NOT EXISTS 'RECORDIS'")
    op.execute("ALTER TYPE categoryactivity ADD VALUE IF NOT EXISTS 'GALLERY'")


def downgrade():
    # PostgreSQL does not support removing enum values reliably if they are in use.
    pass
