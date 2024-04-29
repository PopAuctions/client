const Video = ({
    className,
    participant,
    streamsToDisplay,
    username,
    participantSize,
}) => {
    return (
        <div className="relative">
            <video
                key={participant?.id}
                muted
                autoPlay
                playsInline
                className={className}
                ref={(ref) => {
                    if (ref) {
                        ref.srcObject = new MediaStream();
                        streamsToDisplay?.forEach((stream) =>
                            ref.srcObject.addTrack(stream.mediaStreamTrack)
                        );
                    }
                }}
            />
            <div className="overlay-pill">
                {username ? username : `user-${participantSize}`}
            </div>
        </div>
    );
};

export default Video;