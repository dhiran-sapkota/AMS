# spec/controllers/artists_controller_spec.rb

require 'rails_helper'

RSpec.describe ArtistsController, type: :controller do
  include JwtHelper
  let(:artist_manager) { create(:user, role: 'artist_manager') }
  let(:super_admin) { create(:user, role: 'super_admin') }
  let(:artist) { create(:artist, user: create(:user, role: 'artist', created_by: artist_manager.id)) }

  # Setup for @currentUser
  before do
    @currentUser = artist_manager.as_json
    # allow(controller).to receive(:current_user).and_return(@currentUser)
    request.headers["Authorization"] = "Bearer #{encode_token(artist_manager)}"
  end

  describe 'GET #index' do
    context 'when the user is an artist_manager' do
      it 'returns all artists created by the artist_manager' do
        get :index, params: { limit: 5, offset: 0 }
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['message']).to eq('All artists retrieved successfully')
      end
    end

    context 'when the user is a super_admin' do
      before do
        @currentUser = super_admin.as_json
        # allow(controller).to receive(:getCurrentUser).and_return(@currentUser)
      end

      it 'returns all artists' do
        get :index, params: { limit: 5, offset: 0 }
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['message']).to eq('All artists retrieved successfully')
      end
    end

    context 'with query parameter' do
      it 'filters artists based on the query' do
        get :index, params: { limit: 5, offset: 0, query: artist.user.firstname }

        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['message']).to eq('All artists retrieved successfully')
      end
    end

    context 'with invalid sort_by parameter' do
      it 'defaults to sorting by created_at' do
        get :index, params: { limit: 5, offset: 0, sort_by: 'invalid_column' }

        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['message']).to eq('All artists retrieved successfully')
      end
    end
  end

  describe 'POST #create' do
    context 'with valid params' do
      let(:valid_params) do
        { artist: { "firstname": "artist2manager1",
          "lastname": "Doe",
          "email": "artist6@example.com",
          "password": "password",
          "phone": "1234567890",
          "dob": "1990-01-01",
          "gender": "m",
          "address": "123 Main St, City, Country",
          "first_release_year":"2000",
          "no_of_albums_released":"20"
         } }
      end

      it 'creates a new artist' do
        post :create, params: valid_params

        expect(response).to have_http_status(:created)
        expect(JSON.parse(response.body)['message']).to eq('Artists created successfully')
      end
    end

    context 'with invalid params' do
      let(:invalid_params) do
        { artist: { no_of_albums_released: 5, first_release_year: Time.now.year + 1 }, user: { firstname: 'John', lastname: 'Doe', email: 'john.doe@example.com' } }
      end

      it 'returns an error when the transaction fails' do
        post :create, params: invalid_params

        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)['message']).to eq('Transaction failed')
      end
    end
  end

  describe 'DELETE #destroy' do
    context 'when the artist does not exist' do
      it 'returns an error' do
        delete :destroy, params: { id: 9999 }

        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)['message']).to eq('Cannot delete artist')
      end
    end
  end
end
