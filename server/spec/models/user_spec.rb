require "rails_helper"

RSpec.describe User, type: :Model do
  describe "user model unit testing" do
    it("all required fields should be present") do
      expect {User.create!()}.to raise_error(ActiveRecord::RecordInvalid, "Validation failed: Password can't be blank, Firstname can't be blank, Lastname can't be blank, Email can't be blank, Email is invalid, Phone can't be blank, Dob can't be blank, Gender can't be blank, Address can't be blank, Role can't be blank, Phone must be 10 digits")
    end

    it "is invalid with a duplicate email" do
      user1 = User.create(email: "test@example.com")
      user2 = User.new(email: "test@example.com")
      expect(user2).not_to be_valid
    end

    it "is invalid if phone number is not 10 digits" do
      user = User.new(phone: "123456789")
      expect(user).not_to be_valid
    end

    it "should allow a user to have a creator" do
      creator = User.create(firstname: "Admin", lastname: "User", email: "admin@example.com", phone: "1234567890", dob: "1985-01-01", gender: "m", address: "Admin Street", role: "super_admin", password: "password")
      user = User.create(firstname: "John", lastname: "Doe", email: "john@example.com", phone: "1234567890", dob: "1990-01-01", gender: "m", address: "123 Street", role: "artist", created_by: creator.id, password: "password")
      expect(user.creator).to eq(creator)
    end
    
    it "should allow a user to have many created users" do
      creator = User.create(firstname: "Admin", lastname: "User", email: "admin@example.com", phone: "1234567890", dob: "1985-01-01", gender: "m", address: "Admin Street", role: "super_admin", password: "password")
      user1 = User.create(firstname: "John", lastname: "Doe", email: "john@example.com", phone: "1234567890", dob: "1990-01-01", gender: "m", address: "123 Street", role: "artist", created_by: creator.id, password: "password")
      user2 = User.create(firstname: "Jane", lastname: "Doe", email: "jane@example.com", phone: "1234567891", dob: "1992-01-01", gender: "f", address: "456 Street", role: "artist", created_by: creator.id, password: "password")
      expect(creator.created_users).to include(user1, user2)
    end

    it "should delete associated musics when a user is deleted" do
      user = User.create(firstname: "John", lastname: "Doe", email: "john@example.com", phone: "1234567890", dob: "1990-01-01", gender: "m", address: "123 Street", role: "artist", password: "password")
      music1 = Music.create!(user: user, title:"title", album_name:"album name", genre:"jazz")
      music2 = Music.create!(user: user, title:"title", album_name:"album name", genre:"jazz")
      expect { user.destroy }.to change { Music.count }.by(-2)
    end
    
    it "should have the correct gender" do
      user = User.new(gender: :m)
      expect(user.gender).to eq("m")
    
      user = User.new(gender: :f)
      expect(user.gender).to eq("f")
    
      user = User.new(gender: :o)
      expect(user.gender).to eq("o")
    end
    
    it "should have the correct role" do
      user = User.new(role: :super_admin)
      expect(user.role).to eq("super_admin")
    
      user = User.new(role: :artist_manager)
      expect(user.role).to eq("artist_manager")
    
      user = User.new(role: :artist)
      expect(user.role).to eq("artist")
    end
    
    it "should not authenticate a user with incorrect password" do
      user = User.create(firstname: "John", lastname: "Doe", email: "john@example.com", phone: "1234567890", dob: "1990-01-01", gender: "m", address: "123 Street", role: "artist", password: "password", password_confirmation: "password")
      expect(user.authenticate("wrongpassword")).to be_falsey
    end
    
  end
end