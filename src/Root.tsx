import {Composition} from 'remotion';
import {PlaygroundComposition} from './PlaygroundComposition';

export const fps = 30;
export const durationInFrames = fps * 5;

export const RemotionRoot: React.FC = () => {
	return (
		<Composition
			id="playground"
			component={PlaygroundComposition}
			durationInFrames={durationInFrames}
			fps={fps}
			width={300}
			height={200}
		/>
	);
};
