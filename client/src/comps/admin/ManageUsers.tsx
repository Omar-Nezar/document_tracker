import { useAppDispatch, useAppSelector } from "@/src/store/store";
import { getUsers, disableUser } from "@/src/slices/admin.slice";
import { useEffect } from "react";
import showToast from "@misc/showToast";
import { deleteUser } from "@/src/slices/admin.slice";

import UserTable from "@/src/utils/tables/user/userTable";
import { createUserColumns } from "@/src/utils/tables/user/userColumns";
import { createAdminActions } from "@/src/utils/tables/user/userActions";

export default function ManageUsers() {
    const dispatch = useAppDispatch();
    const { users, loading } = useAppSelector(
        (state: any) => state.admin
    );

    useEffect(() => {
        dispatch(getUsers());
    }, [dispatch]);

    const handleDeleteUser = async (userId: number) => {
        const promise = dispatch(deleteUser(userId)).unwrap();
        showToast({
            promise,
            message: "User deleted successfully",
            description: "User successfully deleted",
        });
        await promise;
    }

    const handleDisableUser = async (userId: number) => {
        const promise = dispatch(disableUser(userId)).unwrap();
        showToast({
            promise,
            message: "User account disabled",
            description: "The user and related records are no longer active",
        });
        await promise;
    }

    const columns = createUserColumns(
       createAdminActions(handleDeleteUser, handleDisableUser)
    )
    return (
        <UserTable
            data={users}
            columns={columns}
            loading={loading}
        />
    )
}