import Image from "next/image";

type AvatarSize = 'sm' | 'md' | 'lg'

interface Props {
    size: AvatarSize
}

const calculateSize = (size: AvatarSize)=>{
   switch(size) {
    case 'sm': return 40; 
    case 'md': return 60;
    case 'lg': return 80;
   }
}

export default function Avatar(props: Props) {
    const mySize = calculateSize(props.size)
    return (
        <div className="flex flex-wrap justify-center gap-12">
            <Image height={mySize} width={mySize} className="rounded-full"
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200"
                alt="userImage1" />
        </div>
    );
};