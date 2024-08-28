import {CalculateMetadataFunction, Composition, Still} from 'remotion';
import {ItemsFadeIn} from './ItemsFadeIn';
import {CoverComposition} from './CoverComposition';
import {EndScene} from './EndSceneComposition';
import {TENTION} from './data';
import {
	CoverSchema,
	GridType,
	ItemsCompositionProps,
	ItemsSchema,
} from './types';
import {ItemsTransition} from './ItemsTransition';
import {z} from 'zod';

export const POSITION: GridType = 3;

export const FACTOR = 5;
export const FPS = FACTOR * 6;
export const GRID: GridType = 12;
export const ItemDurationInFrames = FPS * 6;
export const EntranceDurationInFrames = FPS * 0.5;
export const ExitDurationInFrames = EntranceDurationInFrames;
export const TransitionDurationInFrames = 20;

export const getItemsDurationInFrames = (listLength: number) =>
	ItemDurationInFrames * listLength;

export const getTransitionItemsDurationInFrames = (listLength: number) =>
	ItemDurationInFrames * listLength -
	TransitionDurationInFrames * (listLength - 1);

export const getDurationInFrames = (listLength: number) =>
	EntranceDurationInFrames +
	getItemsDurationInFrames(listLength) +
	ExitDurationInFrames;

export const getTransitionDurationInFrames = (listLength: number) =>
	EntranceDurationInFrames +
	getTransitionItemsDurationInFrames(listLength) +
	ExitDurationInFrames;

export const WIDTH = 1080;
export const HEIGHT = 1920;
export const COLOR = '#252627';
export const HIGHLIGHT = '#F43939';
export const BACKGROUND_COLOR = '#D9DFE2';
export const flexCenter: React.CSSProperties = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
};

export const useLeft = (position: z.infer<typeof ItemsSchema.shape.position>) =>
	(WIDTH / GRID) * position;

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

const calculateFadeInMetadata: CalculateMetadataFunction<
	ItemsCompositionProps
> = ({defaultProps: {wordList}}) => {
	return {durationInFrames: getDurationInFrames(wordList.length)};
};

const calculateTransitionMetadata: CalculateMetadataFunction<
	ItemsCompositionProps
> = ({defaultProps: {wordList}}) => {
	return {durationInFrames: getTransitionDurationInFrames(wordList.length)};
};

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Still
				id="cover"
				component={CoverComposition}
				width={WIDTH}
				height={HEIGHT}
				schema={CoverSchema}
				defaultProps={{
					body: TENTION.affix,
				}}
			/>
			<Composition
				id="itemsFadeIn"
				component={ItemsFadeIn}
				calculateMetadata={calculateFadeInMetadata}
				fps={FPS}
				width={WIDTH}
				height={HEIGHT}
				schema={ItemsSchema}
				defaultProps={{
					position: TENTION.position,
					affix: TENTION.affix,
					affixPhonetic: TENTION.affixPhonetic,
					wordList: TENTION.wordList,
				}}
			/>
			<Composition
				id="itemsTransition"
				component={ItemsTransition}
				calculateMetadata={calculateTransitionMetadata}
				fps={FPS}
				width={WIDTH}
				height={HEIGHT}
				schema={ItemsSchema}
				defaultProps={{
					position: TENTION.position,
					affix: TENTION.affix,
					affixPhonetic: TENTION.affixPhonetic,
					wordList: TENTION.wordList,
				}}
			/>
			<Composition
				id="endScene"
				component={EndScene}
				fps={FPS}
				durationInFrames={90}
				width={WIDTH}
				height={HEIGHT}
			/>
		</>
	);
};
