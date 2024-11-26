require "rails_helper"

RSpec.describe Music, type: :model do
  describe "music model" do
    it "title should be present" do
      music = Music.new(album_name: "test_album", genre: "country")
      expect(music.valid?).to be(false)
      expect(music.errors[:title]).to include("can't be blank")
    end

    it "album name should be present" do
      music = Music.new(title: "title", genre: "country")
      expect(music.valid?).to be(false)
      expect(music.errors[:album_name]).to include("can't be blank")
    end

    it "genre should be present" do
      music = Music.new(album_name: "test_album", title: "title")
      expect(music.valid?).to be(false)
      expect(music.errors[:genre]).to include("can't be blank")
    end

    it "genre should be valid options" do
      music = Music.new(album_name: "test_album", genre: "country", title:"country")
      expect(music.genre).to eq("country")

      music = Music.new(album_name: "test_album", genre: "classic", title:"classic")
      expect(music.genre).to eq("classic")

      music = Music.new(album_name: "test_album", genre: "rock", title:"rock")
      expect(music.genre).to eq("rock")

      music = Music.new(album_name: "test_album", genre: "jazz", title:"jazz")
      expect(music.genre).to eq("jazz")

      expect { Music.new(album_name: "test_album", genre: "country1", title:"country") }.to raise_error(ArgumentError, "'country1' is not a valid genre")
    end

    it "should belong to a user" do
      music = Music.new(album_name: "test_album", title: "title")
      expect(music.valid?).to be(false)

      user = User.create!(firstname: "firstname", lastname: "lastname", email: "random@example.com", password: "password", dob: "2019-01-01", gender: "m", address: "kathmandu", role: "artist", phone: 1234567890)

      music = Music.create!(album_name: "test_album", title: "title", genre:"jazz", user_id: user[:id])
      
      expect(music.valid?).to be(true)
      expect(music.user).to eq(user)
    end
  end
end