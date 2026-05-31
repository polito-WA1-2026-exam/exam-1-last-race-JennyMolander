import { User } from '../models/Models';

const SERVER_URL = 'http://localhost:3001/api'

function jsonHeaders() {
    return {
        'Content-Type': 'application/json',
    };
}

function mapUser(user) {
    return new User(user.id, user.username, user.name);
}

async function login(username, password) {
    try {
        const response = await fetch(`${SERVER_URL}/sessions`, {
            method: 'POST',
            headers: jsonHeaders(),
            credentials: 'include',
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const user = await response.json();
            return mapUser(user);
        } else {
            throw new Error('HTTP error in login, code=' + response.status);
        }
    } catch (ex) {
        throw new Error('Network error in login', { cause: ex });
    }
}

async function logout() {
    try {
        const response = await fetch(`${SERVER_URL}/sessions/current`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('HTTP error in logout, code=' + response.status);
        }
    } catch (ex) {
        throw new Error('Network error in logout', { cause: ex });
    }
}

async function getCurrentUser() {
    try {
        const response = await fetch(`${SERVER_URL}/sessions/current`, {
            credentials: 'include',
        });

        if (response.ok) {
            const user = await response.json();
            return mapUser(user);
        } else {
            throw new Error('HTTP error in getCurrentUser, code=' + response.status);
        }
    } catch (ex) {
        throw new Error('Network error in getCurrentUser', { cause: ex });
    }
}