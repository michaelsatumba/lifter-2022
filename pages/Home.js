import { useEffect, useState } from 'react';
import { authentication, db, storage } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
	addDoc,
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
    const [picture, setPicture] = useState();

    useEffect(() => {
		onAuthStateChanged(authentication, (user) => {
			if (user) {
				console.log('signed in');
				setUser(user);
				setPicture(
					<Image
						src={user?.photoURL}
						alt="userPhoto"
						layout="fill"
						className="rounded-full object-cover"
                        width={500}
                        height={500}
					/>
				);
			} else {
				console.log('not signed in');
				router.push('/');
			}
		});
	}, []);



	const logout = () => {
		signOut(authentication)
			.then(() => {
				router.push('/');
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<div className="flex min-h-screen bg-white">

        <div className='m-auto'>

       
			<div className="flex justify-evenly p-3">
            <p>Lifter</p>
			</div>

            <div className='flex justify-evenly p-3'>
            <p>Welcome {user?.displayName}</p>
            </div>

            <div className='flex flex-col justify-evenly items-center p-3'>
            <p>Step 1: Exercise Interest(s)</p>
            <input type="text" placeholder='Enter exercise interest(s)'/>
            </div>

            <div className='flex justify-evenly'>
            <button className="text-xl text-white font-bold rounded-md bg-gray-400 px-16 py-2 m-5">Update Profile</button>
            </div>

            </div>
           
            

			
		</div>
	);
}

export default Home;