class ApplicationController < ActionController::API
    before_action :enable_foreign_keys

    private
  
    def enable_foreign_keys
      ActiveRecord::Base.connection.execute('PRAGMA foreign_keys = ON')
    end
end
