import CircularProgress from "@mui/material/CircularProgress";

interface LoadingProps {
  open: boolean;
}

const Loading: React.FC<LoadingProps> = ({ open }) => {
  if (!open) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // semi-transparent white
        zIndex: 2
      }}
    >
      <CircularProgress color="primary" />
    </div>
  );
};

export default Loading;
