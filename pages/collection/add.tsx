import React, { useState } from "react";
import { SearchResults } from "@/components/collection-add/SearchResults";
import { SearchForm } from "@/components/collection-add/SearchForm";
import { SearchCardData } from "@/types/addPage";
import { useGeneralCardSearch } from "@/hooks/useGeneralCardSearch";
import { QueryResult } from "@/components/QueryResult";

export default function AddPage() {
	const [searchCardData, setSearchCardData] = useState<SearchCardData>({
		cardName: "",
		setCode: "",
	});

	const [page, setPage] = useState(1);
	const querySearchResponse = useGeneralCardSearch({ searchCardData, page });

	const handleSearchFormSubmit = (newSearchCardData: SearchCardData) => {
		setSearchCardData({ ...newSearchCardData });
	};

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
