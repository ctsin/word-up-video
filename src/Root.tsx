import {Composition} from 'remotion';
import {PlaygroundComposition} from './PlaygroundComposition';

type GridType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export const POSITION: GridType = 4;

export const FACTOR = 5;
export const FPS = FACTOR * 6;
export const GRID: GridType = 12;
export const durationInFrames = FPS * 20;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const COLOR = '#252627';
export const HIGHLIGHT = '#F43939';
export const FlexCenter: React.CSSProperties = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
};

export const useLeft = () => (WIDTH / GRID) * POSITION;

export const secondaryBaseStyle = {
	color: COLOR,
	opacity: 0.2,
};

export const PhoneticSign = () => (
	<span
		style={{
			...secondaryBaseStyle,
			display: 'inline-block',
			margin: '0 0.3em',
		}}
	>
		/
	</span>
);

export const RemotionRoot: React.FC = () => {
	return (
		<Composition
			id="playground"
			component={PlaygroundComposition}
			durationInFrames={durationInFrames}
			fps={FPS}
			width={WIDTH}
			height={HEIGHT}
		/>
	);
};
