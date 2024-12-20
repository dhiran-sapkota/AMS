Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  get "/api/users", to:"users#index"
  post "/api/auth/register", to:"auth#register"
  post "/api/auth/login", to:"auth#login"
  get "/api/auth/validate-token", to:"auth#tokenvalidate"
  
  scope "/api" do
    resources :users
    resources :artists
    resources :musics

    scope "/bulk" do
      get "/music", to:"musics#bulkdownload"
      post "/music", to:"musics#bulkupload"
    end
  end
end
