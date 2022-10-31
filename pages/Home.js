import { useEffect, useState } from 'react';
import { authentication, db, storage } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
	addDoc,
    setDoc,
	collection,
	serverTimestamp,
	deleteDoc,
	doc,
	orderBy,
	onSnapshot,
	query,
	updateDoc,
} from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { useRouter } from 'next/router';
import Image from 'next/image';

function Home() {
	const router = useRouter();

    const [user, setUser] = useState();

    const [interest, setInterest] = useState('');
    const [completedButton, setCompletedButton] = useState('text-xl text-white font-bold rounded-md bg-gray-400 px-16 py-2 m-5')

    const incompleteForm = !interest


    useEffect(() => {
		onAuthStateChanged(authentication, (user) => {
			if (user) {
				console.log('signed in');
				setUser(user);
			} else {
				console.log('not signed in');
				router.push('/');
			}
		});
	}, []);

    useEffect(() => {
    if (interest.length > 0) {
        // alert('hello')
        setCompletedButton('text-xl text-white font-bold rounded-md bg-red-400 px-16 py-2 m-5')
    } else {
        setCompletedButton('text-xl text-white font-bold rounded-md bg-gray-400 px-16 py-2 m-5')
    }
    }, [interest])

    
    const updateUserProfile = (e) => {
        e.preventDefault();
		setDoc(doc(db, 'users', user.uid), {
			id: user.uid,
			displayName: user.displayName,
			photoURL: user.photoURL,
			interest: interest,
			timestamp: serverTimestamp(),
		})
			.then(() => {
				router.push('/House');
			})
			.catch((error) => {
				alert(error.message);
			});
	};

	return (
		<div className="flex min-h-screen bg-white">

        <div className='m-auto'>

       
			<div className="flex justify-evenly p-3">
            <p className="text-3xl font-bold text-[#FF00BF]">Lifter</p>
			</div>

            <div className='flex justify-evenly p-3'>
            <p>Welcome {user?.displayName}</p>
            </div>



        
            <div className='flex flex-col justify-evenly items-center p-3'>
            <p className="text-lg font-bold text-[#FF00BF]">Step 1: Exercise Interest(s)</p>
            </div>
            <form className="flex flex-col items-center justify-evenly">
            <input className="text-lg text-gray-900 p-3" type="text" placeholder='Enter exercise interest(s)' value={interest} onChange={e => setInterest(e.target.value)}/>
          

         
            <button disabled={incompleteForm} className={`${completedButton}`} onClick={updateUserProfile}>Update Profile</button>
       
            </form>

            </div>
           
            

			
		</div>
	);
}

export default Home;