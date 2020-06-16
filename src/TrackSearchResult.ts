/**
 * Model for a result returned from a track search.
 */
export class TrackSearchResult
{
    /**
     * Gets or sets the ID of the track.
     */
    id: string

    /**
     * Gets or sets the name of the track.
     */
    name: string

    /**
     * Gets or sets the artist of the track.
     */
    artist: string

    /**
     * Gets or sets the album of the track.
     */
    album: string

    /**
     * Gets or sets the year of the track.
     */
    year: number

    /**
     * Gets or sets the URL of artwork for the track.
     */
    artworkUrl: string

    /**
     * Constructor.
     */
    constructor(
        id: string,
        name: string,
        artist: string,
        album: string,
        year: number,
        artworkUrl: string,
    ) {
        this.id = id
        this.name = name
        this.artist = artist
        this.album = album
        this.year = year
        this.artworkUrl = artworkUrl
    }

    /**
     * Returns a new instance from the given track search result.
     */
    static from(trackData: TrackSearchResult) {
        return new TrackSearchResult(
            trackData.id,
            trackData.name,
            trackData.artist,
            trackData.album,
            trackData.year,
            trackData.artworkUrl,
        )
    }
}