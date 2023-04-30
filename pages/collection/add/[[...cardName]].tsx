import React, { useState } from "react";
import { SearchResults } from "@/components/collection-add/SearchResults";
import { SearchForm } from "@/components/collection-add/SearchForm";
import { SearchCardData } from "@/types/addPage";
import { QueryResult } from "@/components/QueryResult";
import { useCardSearch } from "@/hooks/useCardSearch";
import { GetServerSideProps } from "next/types";

export default function AddPage({ cardName }: { cardName: string }) {
	const [searchCardData, setSearchCardData] = useState<SearchCardData>({
		cardName: "",
		setCode: "",
	});

	const [page, setPage] = useState(1);
	const querySearchResponse = useCardSearch({ searchCardData, page });

	const handleSearchFormSubmit = (newSearchCardData: SearchCardData) => {
		setSearchCardData({ ...newSearchCardData });
	};

	//todo remove after testing 👇
	console.log("cardName", cardName);
	//todo remove after testing 👆

	return (
		<>
			<h1>Add Cards</h1>
			<SearchForm
				onSubmitSearch={handleSearchFormSubmit}
				disabled={querySearchResponse.isLoading}
			/>
			<QueryResult queryResult={querySearchResponse}>
				<SearchResults cardData={querySearchResponse.data} />
			</QueryResult>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const cardName = context.params?.cardName?.[0] ?? "";
	return {
		props: {
			cardName,
		},
	};
};
