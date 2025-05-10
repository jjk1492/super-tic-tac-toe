'use client';

import Container from "./components/Container";

function HomePage() {
    return (
        <Container>
            <div className="row">
                <div className="col-12">
                    <h1>Super Tic Tac Toe</h1>
                    <p>Welcome to super Tic-Tac-Toe, the game of Tic-Tac-Toe of Tic-Tac-Toes!</p>
                    <p>Select a game type to get started</p>
                </div>
            </div>
        </Container>
    )
}

export default HomePage;
