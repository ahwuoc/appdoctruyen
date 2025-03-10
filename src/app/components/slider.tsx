import { Slider } from 'antd';

export default function SliderRange({ params }: {
    params: {
        maxRange: number;
        onChange: (value: [number, number]) => void;
    };
})
{
    return (
        <div className='flex items-center gap-2 w-full'>
            <p>0</p>
            <Slider
                range={{ draggableTrack: true }}
                min={0}
                max={params.maxRange}
                onChange={(value: number[]) => params.onChange(value as [number, number])}
                className='w-full'
            />
            <p>{params.maxRange}</p>
        </div>
    );
}
