import {Composition} from 'remotion';
import {MyComposition} from './Composition';

const fps = 30;
const durationInFrames = fps * 5;

export const RemotionRoot: React.FC = () => {
	return (
		<Composition
			id="MyComp"
			component={MyComposition}
			durationInFrames={durationInFrames}
			fps={fps}
			width={856}
			height={1852}
		/>
	);
};
