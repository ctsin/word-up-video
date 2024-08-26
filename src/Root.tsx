import {CalculateMetadataFunction, Composition, Still} from 'remotion';
import {ItemsFadeIn} from './ItemsFadeIn';
import {CoverComposition} from './CoverComposition';
import {EndScene} from './EndSceneComposition';
import WORD_LIST from './data';
import {CoverSchema, ItemsCompositionProps, ItemsSchema} from './types';
import {ItemsTransition} from './ItemsTransition';

type GridType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export const POSITION: GridType = 4;

export const AFFIX = 'tention';
export const AFFIX_PHONETIC = 'ˈtenʃən';

export const FACTOR = 5;
export const FPS = FACTOR * 6;
export const GRID: GridType = 12;
export const ItemDurationInFrames = FPS * 6;
export const EntranceDurationInFrames = FPS * 0.5;
export const ExitDurationInFrames = EntranceDurationInFrames;

export const getItemsDurationInFrames = (listLength: number) =>
	ItemDurationInFrames * listLength;

export const getDurationInFrames = (listLength: number) =>
	EntranceDurationInFrames +
	getItemsDurationInFrames(listLength) +
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

const calculateMetadata: CalculateMetadataFunction<ItemsCompositionProps> = ({
	defaultProps: {wordList},
}) => {
	return {durationInFrames: getDurationInFrames(wordList.length)};
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
					body: AFFIX,
				}}
			/>
			<Composition
				id="itemsFadeIn"
				component={ItemsFadeIn}
				calculateMetadata={calculateMetadata}
				fps={FPS}
				width={WIDTH}
				height={HEIGHT}
				schema={ItemsSchema}
				defaultProps={{
					affix: AFFIX,
					affixPhonetic: AFFIX_PHONETIC,
					wordList: WORD_LIST,
				}}
			/>
			<Composition
				id="itemsTransition"
				component={ItemsTransition}
				calculateMetadata={calculateMetadata}
				fps={FPS}
				width={WIDTH}
				height={HEIGHT}
				schema={ItemsSchema}
				defaultProps={{
					affix: AFFIX,
					affixPhonetic: AFFIX_PHONETIC,
					wordList: WORD_LIST,
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
