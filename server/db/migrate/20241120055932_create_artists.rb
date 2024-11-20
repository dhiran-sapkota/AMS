class CreateArtists < ActiveRecord::Migration[7.1]
  def change
    create_table :artists do |t|
      t.integer :no_of_albums_released
      t.integer :first_release_year
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
