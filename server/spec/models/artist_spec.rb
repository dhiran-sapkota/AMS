require 'rails_helper'

RSpec.describe Artist, type: :model do
  let(:user) { User.create(firstname: "Admin", lastname: "User", email: "admin@example.com", phone: "1234567890", dob: "1985-01-01", gender: "m", address: "Admin Street", role: "super_admin", password: "password") }
  let(:valid_attributes) { { user: user, first_release_year: 2000, no_of_albums_released: 5 } }

  describe "artist testing" do
    it "belongs to a user" do
      artist = Artist.new(valid_attributes)
      expect(artist.user).to eq(user)
    end

    it "destroys associated user when artist is destroyed" do
      artist = Artist.create(valid_attributes)
      artist.destroy
      expect(User.find_by(id: user.id)).to be_nil
    end
  

    it "is valid with valid attributes" do
      artist = Artist.new(valid_attributes)
      expect(artist).to be_valid
    end

    it "is invalid if first_release_year is not a number" do
      artist = Artist.new(valid_attributes.merge(first_release_year: "not a number"))
      expect(artist).not_to be_valid
      expect(artist.errors[:first_release_year]).to include("is not a number")
    end

    it "is invalid if first_release_year is in the future" do
      artist = Artist.new(valid_attributes.merge(first_release_year: Time.now.year + 1))
      expect(artist).not_to be_valid
      expect(artist.errors[:first_release_year]).to include("must be less than #{Time.now.year}")
    end
  

    it "has a no_of_albums_released attribute" do
      artist = Artist.new(valid_attributes)
      expect(artist.no_of_albums_released).to eq(5)
    end
  end  
end
