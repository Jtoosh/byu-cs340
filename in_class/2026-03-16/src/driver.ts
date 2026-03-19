import {FollowsDAO} from "./followsDAO.ts";
import {User} from "./entity/User.ts";

async function main() {
    const followsDAO = new FollowsDAO();

    const follower_handle = "@spidey";
    const follower_name = "Spiderman";

    const user1 = await followsDAO.getUser(new User(follower_handle, follower_name, '@person1', 'Person1'))
    console.log(user1?.toString())

    const dataPage = await followsDAO.getPageOfFollowees(follower_handle, 10, undefined)
    console.log(`Who is ${follower_handle} following?\n${dataPage.values}\nHas more pages? ${dataPage.hasMorePages}`)
    const dataPage1 = await followsDAO.getPageOfFollowers("@person1", 10, undefined);
    console.log(`Who is following ${follower_handle}?\n${dataPage1.values}\nHas more pages? ${dataPage1.hasMorePages}`)
}

function generateNames(n: number): string[] {
    const returnList: string[] = [];
    for (let i = 1; i <= n; i++) {
        returnList.push(`Person${i}`);
    }
    return returnList;
}

function generateHandles(n: number): string[] {
    const returnList: string[] = [];
    for (let i = 1; i <= n; i++) {
        returnList.push(`@person${i}`);
    }
    return returnList;
}

main();
