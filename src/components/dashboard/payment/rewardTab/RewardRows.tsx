import { IReward } from "../../../../queries/reward";
import { RewardSortState } from "./RewardList";
import RewardRow from "./RewardRow";

export const RewardRows = ({
  state,
  rewards,
}: {
  state: RewardSortState;
  rewards: IReward[];
}) => {
  return (
    <div
      style={{
        height: `calc(100vh - 72px)`,
        overflow: "auto",
      }}
      className="scroll-align"
    >
      {rewards.map((reward) => (
        <RewardRow key={reward.uuid} reward={reward} />
      ))}
    </div>
  );
};
