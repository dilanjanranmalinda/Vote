import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCD8DZtKNeaHyFHOB55G3ONtbZa_C3fs8o",
    authDomain: "vote-9919f.firebaseapp.com",
    projectId: "vote-9919f",
    storageBucket: "vote-9919f.appspot.com",
    messagingSenderId: "270515183468",
    appId: "1:270515183468:web:cd5d88535a911a1a681d49"
  };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const VotingWidget = () => {
    const [votes, setVotes] = useState({
        Ranil: 0,
        Anura: 0,
        Sajith: 0,
        Namal: 0
    });
    const [totalVotes, setTotalVotes] = useState(0);
    const [hasVoted, setHasVoted] = useState(false);

    const fullNames = {
        Ranil: 'Ranil Wickremesinghe',
        Anura: 'Anura Kumara Dissanayake',
        Sajith: 'Sajith Premadasa',
        Namal: 'Namal Rajapaksa'
    };


    useEffect(() => {
        const storedVote = localStorage.getItem('hasVoted');
        if (storedVote === 'true') {
            setHasVoted(true);
        }
        fetchVotes();
    }, []);

    const fetchVotes = async () => {

        const candidates = ['Ranil', 'Anura', 'Sajith', 'Namal'];
        let total = 0;
        let updatedVotes = { ...votes };

        for (let candidate of candidates) {
            const candidateRef = doc(db, "votes", candidate);
            const docSnap = await getDoc(candidateRef);

            if (docSnap.exists()) {
                updatedVotes[candidate] = docSnap.data().count;
                total += docSnap.data().count;
            } else {
                await setDoc(candidateRef, { count: 0 });
                updatedVotes[candidate] = 0;
            }
        }

        setVotes(updatedVotes);
        setTotalVotes(total);
    };

    const vote = async (candidate) => {
        if (hasVoted) return;

        const candidateRef = doc(db, "votes", candidate);
        await updateDoc(candidateRef, { count: increment(1) });

        await fetchVotes();
        setHasVoted(true);
        localStorage.setItem('hasVoted', 'true');
    };

    const calculatePercentage = (voteCount) => {
        return totalVotes === 0 ? 0 : ((voteCount / totalVotes) * 100).toFixed(2);
    };

    const candidates = ['Ranil', 'Anura', 'Sajith', 'Namal'];
    const colors = ['#03a103', '#d11f43', '#87f266', '#e33434'];

    return (
        
        <div className="voting-widget" style={{ width: '300px', height: '250px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#f9f9f9' }}>
            <h4 style={{ textAlign: 'center' }}> Presidental election 2024<br></br> Vote for President</h4>
            {candidates.map((candidate, index) => (
                <div
                    key={candidate}
                    onClick={!hasVoted?() => vote(candidate):null}
                    style={{
                        marginBottom: '6px',
                        padding: '8px',
                        borderRadius: '5px',
                        position: 'relative',
                        backgroundColor: '#fff',
                        cursor: hasVoted?"not-allowed": 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '12px',
                        transition: 'background-color 0.3s ease',
                        backgroundColor: hasVoted ? '#f1f1f1' : '#fff',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            height: '100%',
                            width:hasVoted? `${calculatePercentage(votes[candidate])}%`:"0",
                            borderRadius: '5px',
                            transition: 'width 0.5s ease',
                            backgroundColor:hasVoted? colors[index]:"#ddd",
                            zIndex: 0
                        }}
                        
                    />

                   <div style={{ position: 'relative', zIndex: 1, flexGrow: 1, textAlign: 'center', fontWeight: 'bold', color: '#333' }}>
                        {hasVoted ? `${candidate} - ${calculatePercentage(votes[candidate])}%` : fullNames[candidate]}
                        
                    </div>
                    
                </div>
                
            ))}
            
            {/* {hasVoted && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: '#fff',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        borderRadius: '8px',
                    }}
                >
                    Thank you for voting!
                </div>
            )} */}
            <a href="https://adstudio.cloud/" style={{color:"gray", textAlign:"center", textDecoration:"none", fontSize:"14px"}}>More Detils</a>
        </div>
    );
};

export default VotingWidget;
