import { useAtomValue } from "jotai";
import { useLocation, useNavigate } from "react-router-dom";
import {
  categoriesStateUpwrapped,
  loadableUserInfoState,
  userInfoState,
} from "@/state";
import { useMemo } from "react";
import { useRouteHandle } from "@/hooks";
import { getConfig } from "@/utils/template";
import headerIllus from "@/static/header-illus.svg";
import SearchBar from "./search-bar";
import TransitionLink from "./transition-link";
import { Icon } from "zmp-ui";
import { DefaultUserAvatar } from "./vectors";

export default function Header() {
  const categories = useAtomValue(categoriesStateUpwrapped);
  const navigate = useNavigate();
  const location = useLocation();
  const [handle, match] = useRouteHandle();
  const userInfo = useAtomValue(loadableUserInfoState);

  const title = useMemo(() => {
    if (handle) {
      if (typeof handle.title === "function") {
        return handle.title({ categories, params: match.params });
      } else {
        return handle.title;
      }
    }
  }, [handle, categories]);

  const showBack = location.key !== "default" && !handle?.noBack;

  return (
    <div className="w-full flex flex-col px-4 bg-gradient-to-r from-primary to-blue-600 text-primaryForeground pt-st overflow-hidden shadow-lg">
      <div className="w-full min-h-14 pr-[90px] flex py-3 space-x-3 items-center">
        {handle?.logo ? (
          <>
            <img
              src={getConfig((c) => c.template.logoUrl)}
              alt={`${getConfig((c) => c.template.shopName)} logo`}
              className="flex-none w-10 h-10 rounded-xl shadow-md"
            />
            <TransitionLink to="/stations" className="flex-1 overflow-hidden">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight">
                  {getConfig((c) => c.template.shopName)}
                </h1>
                <Icon
                  icon="zi-chevron-right"
                  className="text-primaryForeground/80"
                />
              </div>
              <p className="overflow-x-auto whitespace-nowrap text-xs opacity-90">
                {getConfig((c) => c.template.shopAddress)}
              </p>
            </TransitionLink>
          </>
        ) : (
          <>
            {showBack && (
              <div
                className="p-2 cursor-pointer rounded-lg hover:bg-white/10 transition-colors"
                onClick={() => navigate(-1)}
              >
                <Icon icon="zi-arrow-left" />
              </div>
            )}
            <div className="text-xl font-semibold truncate">{title}</div>
          </>
        )}
      </div>
      {handle?.search && (
        <div className="w-full py-3 flex space-x-3">
          <SearchBar
            onFocus={() => {
              if (location.pathname !== "/search") {
                navigate("/search", { viewTransition: true });
              }
            }}
          />
          <TransitionLink
            to="/profile"
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {userInfo.state === "hasData" && userInfo.data ? (
              <img
                className="w-8 h-8 rounded-full ring-2 ring-white/20"
                src={userInfo.data.avatar}
                alt="User avatar"
              />
            ) : (
              <DefaultUserAvatar
                width={32}
                height={32}
                className={userInfo.state === "loading" ? "animate-pulse" : ""}
              />
            )}
          </TransitionLink>
        </div>
      )}
    </div>
  );
}
