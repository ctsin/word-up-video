import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Background} from './Background';
import {Words} from './Words';

export const MyComposition = () => {
	return (
		<AbsoluteFill>
			<Background />
			<AbsoluteFill>
				<Img style={{objectFit: 'none'}} src={staticFile('40.png')} />
				<Img style={{objectFit: 'none'}} src={staticFile('props.png')} />
				<Img style={{objectFit: 'none'}} src={staticFile('component.png')} />
			</AbsoluteFill>
			<Words />
		</AbsoluteFill>
	);
};
