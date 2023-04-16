// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import axios from "axios";
import { helpers } from "../../../util/helpers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const session = await getSession({ req });

	if (!session) {
		res.status(401).send("You must be logged in");
		return;
	}

	const apiUrl = "https://api.scryfall.com";
	const { query, unique, order, page } = req.query;

	//?order=released&q=elvish&unique=prints
	const apiQuery = encodeURIComponent(query as string) + " game:paper lang:en";
	const uniquePrintsQuery = unique ? "&unique=prints" : "";
	const orderQuery = order ? `&order=${order}&dir=asc` : "&order=released&dir=asc"; //direction ascending 1 to XX
	const pageQuery = page ? `&page=${page}` : "&page=1";
	const fullQuery = `${apiUrl}/cards/search/?q=${apiQuery}${orderQuery}${uniquePrintsQuery}${pageQuery}`;
	//console.log(fullQuery)

	try {
		const results = await axios.get(fullQuery);
		res.status(200).json(helpers.apiResponse(true, results?.data?.data));
	} catch (e: any) {
		if (e?.response?.data?.code == "not_found") {
			res.status(200).send(helpers.apiResponse(false, []));
		}

		res.status(500).send(helpers.apiResponse(false));
	}
}
