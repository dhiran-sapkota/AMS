class User < ApplicationRecord

    belongs_to :creator, class_name: "User", optional:true, foreign_key: "created_by"
    has_many :created_users, class_name: "User", foreign_key: "created_by"

    enum gender: { m: 0, f: 1, o: 2 }
    enum role: { super_admin: 0, artist_manager: 1, artist: 2 }

    has_secure_password

    validates :password, presence: true
    validates :firstname, presence: true
    validates :lastname, presence: true
    validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
    validates :phone, presence: true
    validates :dob, presence: true
    validates :gender, presence: true
    validates :address, presence: true
    validates :role, presence: true
    validates :phone, presence: true, format: { with: /\A[0-9]{10}\z/, message: "must be 10 digits" }
end
