import { FakeData, Status } from "tweeter-shared";
import { StatusService } from "../../src/model.service/StatusService";
import "whatwg-fetch";

describe("StatusService Integration Tests", () => {
    let statusService: StatusService;
    let fakeData: FakeData;
    let authToken: any;
    let testUser: any;

    beforeEach(() => {
        statusService = new StatusService();
        fakeData = FakeData.instance;
        authToken = fakeData.authToken;
        testUser = fakeData.firstUser!;
    });

    describe("loadMoreStoryItems", () => {
        it("returns a tuple with Status array and boolean", async () => {
            const [statuses, hasMore] = await statusService.loadMoreStoryItems(
                authToken,
                testUser.alias,
                3,
                null
            );

            expect(statuses).toBeInstanceOf(Array);
            expect(statuses.length).toBeGreaterThan(0);
            for (const status of statuses) {
                expect(typeof status.post).toBe("string");
                expect(status.post.length).toBeGreaterThan(0);
                expect(typeof status.user.alias).toBe("string");
                expect(typeof status.user.firstName).toBe("string");
                expect(typeof status.user.lastName).toBe("string");
                expect(typeof status.user.imageUrl).toBe("string");
            }
            expect(typeof hasMore).toBe("boolean");
        });

        it("accepts empty auth token (server does not validate tokens)", async () => {
            const emptyAuthToken = { ...authToken, token: "" };

            const result = await statusService.loadMoreStoryItems(
                emptyAuthToken,
                testUser.alias,
                3,
                null
            );

            expect(result).toBeInstanceOf(Array);
        });
    });
});
