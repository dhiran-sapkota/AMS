class AddCreatedByToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :created_by, :integer, null: true
    add_foreign_key :users, :users, column: :created_by
  end
end
