class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :firstname
      t.string :lastname
      t.string :email
      t.string :password_digest
      t.string :phone
      t.date :dob
      t.integer :gender
      t.text :address

      t.timestamps
    end
  end
end
