import {useCoins} from '../hooks/useCoins';

export default function Home() {
    const {data, isLoading, error} = useCoins();

    if (isLoading) return <div>Loading coins...</div>;
    if (error) return <div>Error loading coins</div>;
    if (!data) return <div>No data</div>;

    return (
        <div>
            <h2>Coins Loaded: {data.length}</h2>
            <pre>{JSON.stringify(data[0], null, 2)}</pre>
        </div>
    );
}