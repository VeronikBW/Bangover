"""replace nickname with code in user

Revision ID: d2a8f5e9c1b4
Revises: b9553a6206ef
Create Date: 2026-04-06 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd2a8f5e9c1b4'
down_revision = 'b9553a6206ef'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_constraint('uq_user_code', type_='unique')
        batch_op.drop_column('code')
        batch_op.alter_column(
            'nickname',
            existing_type=sa.String(length=120),
            new_column_name='code',
            nullable=False,
        )


def downgrade():
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.alter_column(
            'code',
            existing_type=sa.String(length=120),
            new_column_name='nickname',
            nullable=False,
        )
        batch_op.add_column(
            sa.Column('code', sa.String(length=120), nullable=True))

    op.execute('UPDATE "user" SET code = nickname WHERE code IS NULL')

    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.alter_column(
            'code', existing_type=sa.String(length=120), nullable=False)
        batch_op.create_unique_constraint('uq_user_code', ['code'])
