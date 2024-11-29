# spec/controllers/musics_controller_spec.rb
require 'rails_helper'

RSpec.describe MusicsController, type: :controller do
  include JwtHelper

  # Setup mock data
  let(:artist) { create(:user, role: 'artist') }
  let(:music) { create(:music, user: artist) }

  before do
    # Mock the current user
    # allow(controller).to receive(current_user).and_return(artist)
    request.headers["Authorization"] = "Bearer #{encode_token({
      user_id: :artist["id"],
      firstname: :artist["firstname"],
      lastname: :artist["lastname"],
      email: :artist["email"],
      phone: :artist["phone"],
      dob: :artist["dob"],
      gender: :artist["gender"],
      address: :artist["address"],
      role: "artist"
    })}"
  end

  describe 'GET #index' do
    context 'when artist ID is missing' do
      it 'returns a bad request response' do
        get :index
        expect(response).to have_http_status(:bad_request)
        expect(response.body).to include("Artist ID is required")
      end
    end

    context 'when artist ID is present' do
      it 'returns a successful response with music data' do
        get :index, params: { id: artist.id }
        expect(response).to have_http_status(:ok)
        expect(response.body).to include("Musics retrieved successfully")
      end
    end
  end

  describe 'POST #create' do
    # context 'with valid attributes' do
    #   it 'creates a new music record' do
    #     puts "reached here-------------------------"
    #     puts music.inspect
    #     music_params = { title: "New Song", album_name: "New Album", genre: "rnb" }
    #     post :create, params: { music: music_params }
    #     puts response.body
        
    #     expect(response).to have_http_status(:created)
    #     expect(response.body).to include("Music created successfully")
    #   end
    # end

    context 'with invalid attributes' do
      it 'does not create a new music record' do
        music_params = { title: "", album_name: "New Album", genre: "rnb" }
        post :create, params: { music: music_params }
        
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.body).to include("Validation failed")
      end
    end
  end

  # describe 'PUT #update' do
  #   context 'when the user is authorized' do
  #     it 'updates the music record' do
  #       music_params = { title: "Updated Song" }
  #       put :update, params: { id: music.id, music: music_params }
  #       puts response.body

  #       expect(response).to have_http_status(:ok)
  #       expect(music.reload.title).to eq("Updated Song")
  #     end
  #   end

  #   context 'when the user is unauthorized' do
  #     it 'returns an unauthorized response' do
  #       another_user = create(:user, role: 'artist')
  #       request.headers["Authorization"] = "Bearer #{encode_token(another_user)}"

  #       music_params = { title: "Updated Song" }
  #       put :update, params: { id: music.id, music: music_params }

  #       expect(response).to have_http_status(:unauthorized)
  #       expect(response.body).to include("not allowed to update music")
  #     end
  #   end
  # end

  # describe 'DELETE #destroy' do
  #   context 'when the music exists' do
  #     it 'deletes the music record' do
  #       delete :destroy, params: { id: music.id }
        
  #       expect(response).to have_http_status(:ok)
  #       expect(response.body).to include("Music deleted successfully")
  #     end
  #   end

  #   context 'when the music does not exist' do
  #     it 'returns a not found response' do
  #       delete :destroy, params: { id: 9999 } # Invalid ID
        
  #       expect(response).to have_http_status(:not_found)
  #       expect(response.body).to include("Cannot find music with that ID")
  #     end
  #   end
  # end
end
