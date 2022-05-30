export const getTrack = (track) => {
  const stream = new MediaStream();
  stream.addTrack(track);
  return stream;
};
