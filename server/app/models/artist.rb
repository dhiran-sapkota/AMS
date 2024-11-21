class Artist < ApplicationRecord
  belongs_to :user, dependent: :destroy
end
