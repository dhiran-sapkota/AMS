module JwtHelper
    def encode_token(payload)
        #TODO use env variable for secret
        JWT.encode(payload, "secret")
    end

    def decode_token(token)
        JWT.decode(token, "secret").first
    rescue JWT::DecodeError
        nil
    end
end