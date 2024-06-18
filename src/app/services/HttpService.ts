const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
console.log(baseUrl)
export const submitBet = async (data: any) => {
    const response = await fetch(`${baseUrl}/bet`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return response.json();
}

export const getBetHistory = async (name: string) => {
    const response = await fetch(`${baseUrl}/bet?name=${name}`);
    return response.json();
}

export const submitMatch = async (data: any) => {
    const response = await fetch(`${baseUrl}/bet/match`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return response.json();
}

export const getMatchHistory = async () => {
    const response = await fetch(`${baseUrl}/bet/match`);
    return response.json();
}

export const editMatch = async (data: any) => {
    const response = await fetch(`${baseUrl}/bet/edit-match`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return response.json();
}

export const getPlayers = async () => {
    const response = await fetch(`${baseUrl}/bet/player`);
    return response.json();
}

export const editPlayer = async (data: any) => {
    const response = await fetch(`${baseUrl}/bet/player`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return response.json();
}

export const getAllBetHistory = async () => {
    const response = await fetch(`${baseUrl}/bet/all-bet-history`);
    return response.json();
}