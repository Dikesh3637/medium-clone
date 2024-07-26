import { Navbar } from "./_components/navbar";

const ReadLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<Navbar />
			{children}
		</>
	);
};

export default ReadLayout;
