export const EMAIL_REGEX = /\S+@\S+\.\S+/

export const DATE_FORMAT = "YYYY-MM-DD"

export const PHONE_REGEX = /^[0-9]{10,20}$/

export const QUERY_KEYS = {
    USER : "user",
    ARTIST : "artist",
    MUSIC : "music"
}

export const genderMap = new Map()
genderMap.set("m", "Male")
genderMap.set("f", "Female")
genderMap.set("o", "Other")

export const roleMap = new Map()
roleMap.set("artist_manager", "Artist Manager")
roleMap.set("artist", "Artist")
roleMap.set("super_admin", "Super Admin")

export const LIMIT = 10